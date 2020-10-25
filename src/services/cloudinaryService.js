const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
})

module.exports = {
    uploadImages(images) {
        var cont = 0;
        images.map(async image => {
            return await cloudinary.uploader.upload(image.path, { use_filename: true, unique_filename: false }, function (err, result) {
                if (err !== undefined) {
                    console.log("error " + err);

                } else {
                    console.log("Photo uploaded " + image.filename + ` (${cont + 1}/${images.length})`);
                    cont++;
                }
            })
        })
    },
    destroyImages(images) {
        var cont = 0;
        images.map(async image => {
            const slicename = image.path.slice(0, -4);
            return await cloudinary.uploader.destroy(`${slicename}`, { resource_type: 'image', invalidate: true }, function (err, result) {
                if (err !== undefined) {
                    console.log("error " + err);

                } else {
                    console.log(" Photo destroyed " + image.path + ` (${cont + 1}/${images.length})`);
                    cont++;
                }
            })
        })
    }
}