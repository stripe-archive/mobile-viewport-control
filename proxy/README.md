# Proxy

This is a last resort method for testing our library on browsers that do not
support JS injection via bookmarklet or devtools.

This script will setup a website proxy which will inject JS into webpages using
a [man-in-the-middle attack]. It uses [node-http-mitm-proxy].

[man-in-the-middle attack]:https://en.wikipedia.org/wiki/Man-in-the-middle_attack
[node-http-mitm-proxy]:https://github.com/joeferner/node-http-mitm-proxy

## Setup

To setup, we must start the proxy server, upload its certificate your iOS
device, then connect it to the proxy.

1. Start the proxy server:

   ```
   $ npm install
   $ node proxy.js
   ```

2. You now want to send the proxy's certificate to your iOS device that you
   want to test.  The certificate is generated after running the proxy and is
   located here:

   ```
   .http-mitm-proxy/certs/ca.pem
   ```

   You can email the file to your phone, and open the file attachment in
   Safari, which will proceed with the steps for adding the certificate as a
   trusted profile on your phone.

3. Finally, make sure your phone is connected to the same Wifi network as the
   running proxy server.  Under Settings > Wi-Fi > (Your Network), under HTTP
   Proxy, select Manual and fill in:

   ```
   Server:    <your server's ip address>
   Port:      8081
   ```

4. Any webpage you navigate to on your phone should now have the injected JS.
