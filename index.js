addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

const MOBILE_REDIRECT_HOSTNAMES = {
  'a.example.com': 'a.m.example.com',
  'www.example.com': 'm.example.com',
  'example.com': 'm.example.com'
}

async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let hostname = requestURL.hostname
  let device = request.headers.get('CF-Device-Type')
  console.log(device)

  /**
   *  Requires Enterprise "CF-Device-Type Header" zone setting or
   *  Page Rule with "Cache By Device Type" setting applied.
   */
  if (device === "mobile") {
    const mobileSubdomain = MOBILE_REDIRECT_HOSTNAMES[hostname]
    if (mobileSubdomain) {
      // Construct the new location based on the original request URL parameters
      requestURL.hostname = mobileSubdomain
      return Response.redirect(requestURL, 302)
    }
  }
  return await fetch(request)
}