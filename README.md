# install

- git clone https://github.com/RosieCode95/ShareExpress.git
- cd ShareExpress
- npm install
- node init.js




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
Some variables are assesable in the view.hbs page.
- `{{name}}` - server name
- `{{image}}` - image location (username/image.png)
- `{{user}}` - username
- `{{fullImage}}` - entire URL to the image

index.hbs

- `{{name}}` - server name