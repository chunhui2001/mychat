#!/usr/bin/env bash
seq 9 | parallel -j 9 --workdir $PWD node ./server.js {} > /tmp/local.chat.com.log