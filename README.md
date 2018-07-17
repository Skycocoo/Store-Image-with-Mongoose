# Store-Image-with-Mongoose


### References

[Store and Read Image/ File in MongoDB using nodejs,Express,Mongoose](http://blog.nbostech.com/2016/10/store-and-read-image-file-in-mongodb-using-nodejsexpressmongoose/)

[Upstream repo](https://github.com/TarunKashyap18/storeImage)

[Gist discussing storing image with mongoose](https://gist.github.com/aheckmann/2408370)

### Installation

install packages: ```$ npm install```

note that you need to have a mongodb running with default port (localhost:27017) to run the project

to run the project: ```$ node app.js```

to test the result:

- first open ```http://localhost:8000``` to upload a random image;

- then open ```http://localhost:8000/images``` to check the ```_id``` of the stored image;

to check the image:

- open ```http://localhost:8000/picture/(the _id you just checked)```
