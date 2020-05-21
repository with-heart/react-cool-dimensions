/* eslint-disable no-param-reassign, prefer-destructuring */

import {RefObject, useState, useRef, useEffect, useCallback} from 'react'

export const observerErr =
  "💡react-cool-dimensions: the browser doesn't support Resize Observer, please use polyfill: https://github.com/wellyshen/react-cool-dimensions#resizeobserver-polyfill"

interface State {
  currentBreakpoint: string
  width: number
  height: number
  entry?: ResizeObserverEntry
}
interface Event extends State {
  entry: ResizeObserverEntry
  observe: () => void
  unobserve: () => void
}
interface OnResize {
  (event: Event): void
}
type Breakpoints = {[key: string]: number}
export interface Options {
  breakpoints?: Breakpoints
  onResize?: OnResize
  polyfill?: any
}
export interface Return {
  readonly currentBreakpoint: string
  readonly width: number
  readonly height: number
  readonly entry?: ResizeObserverEntry
  readonly observe: () => void
  readonly unobserve: () => void
}

const getCurrentBreakpoint = (bps: Breakpoints, w: number): string => {
  let curBp = ''
  let max = -1

  Object.keys(bps).forEach((key: string) => {
    const val = bps[key]

    if (w >= val && val > max) {
      curBp = key
      max = val
    }
  })

  return curBp
}

const useDimensions = (
  ref: RefObject<HTMLElement>,
  {breakpoints, onResize, polyfill}: Options = {},
): Return => {
  const [state, setState] = useState<State>({
    currentBreakpoint: '',
    width: 0,
    height: 0,
  })
  const prevSizeRef = useRef<{width?: number; height?: number}>({})
  const prevBreakpointRef = useRef<string>()
  const isObservingRef = useRef<boolean>(false)
  const observerRef = useRef<ResizeObserver>(null)
  const onResizeRef = useRef<OnResize>(null)

  useEffect(() => {
    onResizeRef.current = onResize
  }, [onResize])

  const observe = useCallback((): void => {
    if (isObservingRef.current || !observerRef.current) return

    observerRef.current.observe(ref.current)
    isObservingRef.current = true
  }, [ref])

  const unobserve = useCallback((): void => {
    if (!isObservingRef.current || !observerRef.current) return

    observerRef.current.disconnect()
    isObservingRef.current = false
  }, [])

  useEffect(() => {
    if (!ref || !ref.current) return (): void => null

    if (
      (!('ResizeObserver' in window) || !('ResizeObserverEntry' in window)) &&
      !polyfill
    ) {
      console.error(observerErr)
      return (): void => null
    }

    observerRef.current = new (window.ResizeObserver || polyfill)(
      ([entry]: ResizeObserverEntry[]) => {
        const {contentBoxSize, contentRect} = entry
        // @juggle/resize-observer polyfill has different data structure
        const contentBoxSz = Array.isArray(contentBoxSize)
          ? contentBoxSize[0]
          : contentBoxSize
        const width = contentBoxSz ? contentBoxSz.inlineSize : contentRect.width
        const height = contentBoxSz
          ? contentBoxSz.blockSize
          : contentRect.height

        if (
          width === prevSizeRef.current.width &&
          height === prevSizeRef.current.height
        )
          return

        prevSizeRef.current = {width, height}

        const e = {
          currentBreakpoint: '',
          width,
          height,
          entry,
          observe,
          unobserve,
        }

        if (breakpoints) {
          e.currentBreakpoint = getCurrentBreakpoint(breakpoints, width)

          if (e.currentBreakpoint !== prevBreakpointRef.current) {
            if (onResizeRef.current) onResizeRef.current(e)
            prevBreakpointRef.current = e.currentBreakpoint
          }
        } else if (onResizeRef.current) {
          onResizeRef.current(e)
        }

        setState({
          currentBreakpoint: e.currentBreakpoint,
          width,
          height,
          entry,
        })
      },
    )

    observe()

    return (): void => {
      unobserve()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(breakpoints), observe, unobserve])

  return {...state, observe, unobserve}
}

export default useDimensions
