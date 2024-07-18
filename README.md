# Kaishi-Labot


## 動作確認方法
1. docker imageの作成
```sh
docker-compose build
```
2. コンテナの起動
```sh
docker-compose up
```
3. コンテナにアタッチ
```sh
docker exec -it mobile-app-react-native sh
```
4. npm install
  ```sh
  npm install
  ```
5. expoアプリの起動
```sh
npx expo start --tunnel
```
