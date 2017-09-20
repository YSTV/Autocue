# Autocue

## Installation
Clone repo to a location on disk and configure the webserver

### Webserver

For Nginx, the following configuration will work. Other webservers may need a different configuration

```
server {
        listen 80;

        root /path/to/autocue/www;
        server_name autocue.example.com;

        location / {
                try_files $uri $uri/ /index.html;
        }

        location /autocue {
                proxy_pass http://localhost:8486;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```

## Running

Run the start.sh script from the directory it is in.

Go to autocue.example.com and the autocue will start.

## Control

Pressing certain keys while on the autocue webpage will perform certain actions:

* `r` - Reverses the screen from left to right to right to left.
* `up arrow` - scrolls upwards.
* `down arrow` - scrolls downwards.
* `0` - Resets page to top.
* ` - Opens or closes the text editing window.
* `shift + mouse movement` - scrolls the autocue up or down at a variable speed
* `+` - Makes text larger.
* `-` - Makes text smaller.

By using `?rtl=true` in the URL, it will open with right to left already enabled.
