Resources used in process of writing this front-end chat application.

## [apiaryio](https://app.apiary.io/)
[Official syntax](https://github.com/apiaryio/mson)<br/>
[Interactive documentation](https://help.apiary.io/tools/interactive-documentation/ ) <br/>
[URI templates and parameters](https://help.apiary.io/api_101/uri-templates/) <br/>
[Apiaryo example (real-world)](https://voyant.docs.apiary.io/#reference/emergency/emergency-service-resource-for-a-number) <br/>



## Login implementation
[Basic overview](https://medium.com/@vivekmadurai/different-ways-to-authenticate-a-web-application-e8f3875c254a)

Notes: <br/>
##### Cookie based authentication
1] Client authenticates himself via username and pw (to server).<br/>
2] Servers creates session id and sends it back to client<br/>
3] All of clients request includes session id cookie<br/>
4] cookie is cleared from client and server on logout action<br/>

##### Token based authentication
Similar to cookie. Token is not saved on server.<br/>
 This one is newer and more popular then cookie.
 
 "proxy": "http://private-d09b32-chatpwa.apiary-mock.com",
 
 
##### [Popup form](https://www.w3schools.com/howto/howto_js_popup_form.asp)
 Využito pro přidání nového chatu.
 
 ##### [Bootstrap chat template](https://bootsnipp.com/snippets/1ea0N)
 Využito jako šablona pro návrh hlavního okna chatu.

##### [What is a Promise - pouziva axios](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261)
Pomerne podrobny clanek na ktery jsem se dostal diky https://stackoverflow.com/questions/41194866/how-to-set-state-of-response-from-axios-in-react

##### [React dynamic adding of elements to Render method](https://stackoverflow.com/questions/29149169/how-to-loop-and-render-elements-in-react-js-without-an-array-of-objects-to-map)

##### [WebSocket and HTTP2 features](https://building.lang.ai/our-journey-from-websockets-to-http-2-4d069c54effd)

##### [Websocket](https://blog.logrocket.com/websockets-tutorial-how-to-go-real-time-with-node-and-react-8e4693fbf843/)


howTo deploy to Heroku:
 - $ heroku login
 - $ git add .
 - $ git commit -am "make it better"
 - $ heroku create
 - $ git push heroku master
 
 Heroku proxz 
 https://stackoverflow.com/questions/49165232/reactjs-app-in-heroku-invalid-host-header-host-configuration
 
 
 https://github.com/mars/create-react-app-buildpack
 
 heroku config:set API_URL="https://mysterious-caverns-73927.herokuapp.com/" -a pwa-chat-frontend
 
 https://stackoverflow.com/questions/28625351/uncaught-securityerror-failed-to-construct-websocket-an-insecure-websocket-c
 
 TO STUDZ: 
 https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
 
 wss debug
 https://kaazing.com/inspecting-websocket-traffic-with-chrome-developer-tools/
 
 wss implementations
 https://stackoverflow.com/questions/16392260/which-websocket-library-to-use-with-node-js
 

