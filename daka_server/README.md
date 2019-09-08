
### 项目说明
UPDATE 2019/02/20

#### 部署
``` 
#配置信息
cp config.js.example config.js

#启动docker
cd docker-production
cp ../package.json ./
docker-compose build --no-cache
docker-compose up -d

#检查docker, 正常的话可以看到2个online instance
docker exec -it wafter2 sh
pm2 ls

```


#### 访问接口说明

推送码入库： POST /weapp/saveFormIdBySession

推送码定时推送执行：
```
curl -X GET   http://127.0.0.1:3001/weapp/sendFormMessage    -H 'cache-control: no-cache'   -H 'content-type:  application/json'   -H 'token:  AmBg3C2p1sGXPmCxsN8'
```

debug:
```
npm run dev
npm run devcron
```

run:
``` 
npm run start
```

stop:
``` 
npm stop
```
