"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const cloudinary_1 = require("cloudinary");
const into_stream_1 = __importDefault(require("into-stream"));
const utils_1 = __importDefault(require("@strapi/utils"));
module.exports = {
    init(options) {
        cloudinary_1.v2.config(options);
        const upload = (file, customConfig = {}) => {
            return new Promise((resolve, reject) => {
                const config = {
                    resource_type: 'auto',
                    public_id: file.hash,
                };
                if (file.ext) {
                    config.filename = `${file.hash}${file.ext}`;
                }
                if (file.path) {
                    config.folder = file.path;
                }
                const uploadStream = cloudinary_1.v2.uploader.upload_chunked_stream({ ...config, ...customConfig }, (err, image) => {
                    if (err) {
                        if (err.message.includes('File size too large')) {
                            reject(new utils_1.default.errors.PayloadTooLargeError());
                        }
                        else {
                            reject(new Error(`Error uploading to cloudinary: ${err.message}`));
                        }
                        return;
                    }
                    if (!image) {
                        return;
                    }
                    if (image.resource_type === 'video') {
                        file.previewUrl = cloudinary_1.v2.url(`${image.public_id}.gif`, {
                            video_sampling: 6,
                            delay: 200,
                            width: 250,
                            crop: 'scale',
                            resource_type: 'video',
                        });
                    }
                    file.url = image.secure_url;
                    file.provider_metadata = {
                        public_id: image.public_id,
                        resource_type: image.resource_type,
                    };
                    resolve();
                });
                if (file.stream) {
                    file.stream.pipe(uploadStream);
                }
                else if (file.buffer) {
                    (0, into_stream_1.default)(file.buffer).pipe(uploadStream);
                }
                else {
                    throw new Error('Missing file stream or buffer');
                }
            });
        };
        return {
            uploadStream(file, customConfig = {}) {
                return upload(file, customConfig);
            },
            upload(file, customConfig = {}) {
                return upload(file, customConfig);
            },
            async delete(file, customConfig = {}) {
                try {
                    const { resource_type: resourceType, public_id: publicId } = file.provider_metadata ?? {};
                    const deleteConfig = {
                        resource_type: (resourceType || 'image'),
                        invalidate: true,
                        ...customConfig,
                    };
                    const response = await cloudinary_1.v2.uploader.destroy(`${publicId}`, deleteConfig);
                    if (response.result !== 'ok' && response.result !== 'not found') {
                        throw new Error(response.result);
                    }
                }
                catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Error deleting on cloudinary: ${error.message}`);
                    }
                    throw error;
                }
            },
        };
    },
};
//# sourceMappingURL=index.js.map