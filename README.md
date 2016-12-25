# mychat


# https://www.nginx.com/blog/websocket-nginx/
# http://blog.fens.me/nodejs-websocket-nginx/


# socket.io使用Nodejs自带的cluster与集群多进程方案:
# http://www.open-open.com/lib/view/open1447034396335.html

# https://github.com/elad/node-cluster-socket.io

# Using multiple nodes
# http://socket.io/docs/using-multiple-nodes/
# Setting up a Node.js Cluster:
# http://stackabuse.com/setting-up-a-node-js-cluster/

# 600k concurrent websocket connections on AWS using Node.js
# https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/

# Making Multiplayer HTML5 Game: Multiple WebSocket Connections. NodeJs Tutorial Guide
# https://www.youtube.com/watch?v=_GioD4LpjMw


# 1. Using multiple nodes
# http://socket.io/docs/using-multiple-nodes/

# 2. Create a Cluster Server with Node.js and socket.IO
# http://www.html5gamedevs.com/topic/12321-create-a-cluster-server-with-nodejs-and-socketio/

# 3. socketcluster
# http://socketcluster.io/#!/docs/getting-started



# HAProxy Loadbalancer
$ sudo apt-get install haproxy
> sudo vi /etc/default/haproxy
  ENABLE=1


$ sudo service haproxy status$

$ sudo vi /etc/haproxy/haproxy.cfg
> frontend tutorial_in
	bind *:80
	default_backend tutorial_http

  backend tutorial_http
  	server web1 192.168.0.1:80 check
  	server web2 192.168.0.2:80 check
  	server web2 192.168.0.3:80 check
  	server web2 192.168.0.4:80 check

