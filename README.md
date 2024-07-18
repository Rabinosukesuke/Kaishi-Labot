# Kaishi-Labot

## 動作確認前準備

1.dockerを立ち上げる

2.ターミナルを立ち上げる

3.ターミナルでgit clone
```
git clone
```
4.git clone後、Cloning into 'ファイル名'を確認
```
git clone https://github.com/Rabinosukesuke/Kaishi-Labot.git
```
5.ファイルに移動
```
cd Kaishi-Labot
```
その後、動作確認方法１に進む

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
docker exec -it kaishi-labot sh
```
4. npm install
  ```sh
  npm install
  ```
5. expoアプリの起動
```sh
npx expo start --tunnel
```
