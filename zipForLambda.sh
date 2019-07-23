mkdir tmp
cp -r ./dist/*.js ./tmp/
cp -r ./package.json ./tmp/
cp -r ./.env ./tmp/
cp -r ./node_modules/ ./tmp/node_modules
cp -r ./event.json ./tmp/
cd tmp
zip -r ../test.zip .