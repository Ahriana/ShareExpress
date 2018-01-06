# install

- git clone https://github.com/RosieCode95/ShareExpress.git
- cd ShareExpress
- npm install
- node init.js

# server options
```json
"serverName" // name of server
"serverPort" // server port
"serverLocation" // url used to access server
"isProxy" // is the server behind a reverse proxy?
"maxSize" // max upload size in MB
"useMeta" // should additional meta data be stored?
```


# ShareX example config
```json
{
  "Name": "RC test",
  "DestinationType": "ImageUploader",
  "RequestURL": "http://localhost:3030/upload",
  "FileFormName": "file",
  "Arguments": {
    "key": "asldgjnsadloikgfnSAdgklJASWDNFGKAJSD",
    "userName": "%un",
    "fileName": "%guid"
  }
}
```

# variables
Some variables are accessible in the view.hbs page.
- `{{name}}` - server name
- `{{image}}` - image location (username/image.png)
- `{{user}}` - username
- `{{fullImage}}` - entire URL to the image

The `useMeta` option in enabled additional information will be available through the `{{meta}}` variable. This can look like this
```js
 { originalname: 'cmd_2018-01-06_11-57-25.png',
 encoding: '7bit',
 mimetype: 'image/png',
 destination: '/root/projects/ShareExpress/public/images/rose',
 filename: '1515239845.png',
 path: '/root/projects/ShareExpress/public/images/rose/1515239845.png',
 size: 721244,
 time: 'Sat Jan 06 2018 06:57:27 GMT-0500 (EST)' }
 ```
 
index.hbs

- `{{name}}` - server name

