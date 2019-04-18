#!/bin/bash
totalm=$(free -m | awk '/^Mem:/{print $2}')
if [ "$totalm" -lt "1800" ]; then
    echo "Countly requires at least 2Gb of RAM" 
    exit 1
fi
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DATE=`date +%Y-%m-%d:%H:%M:%S`
if [ -f $DIR/offline_installer.sh ]; then
    bash $DIR/offline_installer.sh 2>&1 | tee $DIR/../log/countly-install-$DATE.log
elif [ -f /etc/debian_version ]; then
    bash $DIR/countly.install_ubuntu.sh 2>&1 | tee $DIR/../log/countly-install-$DATE.log
elif [ -f /etc/redhat-release ]; then
    bash $DIR/countly.install_rhel.sh 2>&1 | tee $DIR/../log/countly-install-$DATE.log
fi
