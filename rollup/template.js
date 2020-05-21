// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default ({files}) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="assets/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="assets/logo192.png" />
      <link rel="manifest" href="assets/manifest.json" />
      <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href=${files.css[0].fileName} />
      <title>React Cool Dimensions</title>
      <meta property="og:title" content="React Cool Dimensions" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://react-cool-dimensions.netlify.app/assets/og_image.png" />
      <meta property="og:description" content="React hook to measure an element's size and handle responsive components." />
      <meta property="og:url" content="https://react-cool-dimensions.netlify.app" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@react-cool-dimensions" />
      <meta name="twitter:creator" content="@wellyshen" />
    </head>
    <body>
      <div id="app"></div>
      <script type="text/javascript" src=${files.js[0].fileName}></script>
    </body>
  </html>
`
