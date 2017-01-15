# mychat

# 1. setup node server with node cluster by sticky-session
# http://www.open-open.com/lib/view/open1447034396335.html

# 2. setup socket.io by socket.io
.. 

# 3. Configure HAProxy to Scale Socket.io Node.js Apps With SSL
# [*] http://blog.davidmisshula.com/blog/2013/02/04/configure-haproxy-to-scale-multiple-nodes-with-stickiness-and-ssl/
# https://serversforhackers.com/load-balancing-with-haproxy



# 4. configuration HAProxy Loadbalancer
$ sudo apt-get install haproxy
> sudo vi /etc/default/haproxy
  ENABLE=1


$ sudo service haproxy status$

$ sudo vi /etc/haproxy/haproxy.cfg
> frontend webloading_in
        bind *:80
        default_backend webloading_http

  backend webloading_http
        mode        http
        balance     roundrobin
        cookie      SERVERID insert indirect nocache
        option      forwardfor
        timeout     server 30000
        timeout     connect 4000
        server web1 192.168.0.106:3001 cookie web1 weight 1 maxconn 1024 check
        server web2 192.168.0.106:3002 cookie web2 weight 1 maxconn 1024 check
        server web3 192.168.0.106:3003 cookie web3 weight 1 maxconn 1024 check




# refer: socketcluster
# http://socketcluster.io/#!/docs/getting-started

# refer: node-cluster-socket.io
# https://github.com/elad/node-cluster-socket.io 



# 5. 600k concurrent websocket connections on AWS using Node.js
# https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/
> node --nouse-idle-notification --expose-gc --max-new-space-size=2048 --max-old-space-size=8192 server_cluster.js



# How To Secure HAProxy with Let's Encrypt on Ubuntu 14.04:
# https://www.digitalocean.com/community/tutorials/how-to-secure-haproxy-with-let-s-encrypt-on-ubuntu-14-04



# RabbitMQ
# http://blog.csdn.net/anzhsoft/article/details/19563091
> http://localhost:15672
> http://www.rabbitmq.com/devtools.html
> https://www.rabbitmq.com/management.html
> http://linuxpitstop.com/rabbitmq-cluster-on-centos-7/


# Redis Cluster
> http://sharadchhetri.com/2014/10/04/install-redis-server-centos-7-rhel-7/
> http://linoxide.com/storage/install-redis-server-centos-7/
> https://www.digitalocean.com/community/tutorials/how-to-configure-a-redis-cluster-on-centos-7






