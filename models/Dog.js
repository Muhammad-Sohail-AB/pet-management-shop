const mongoose = require('mongoose');
const DogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please provide the dog's name`],
      trim: true,
      maxlength: [100, `Name can not be more than 100 characters`],
    },
    breed: {
      type: String,
      required: [true, `Please provide the dog's breed`],
      trim: true,
      maxlength: [150, `Dog's breed title can not be more than 150 characters`],
    },
    image: {
      type: String,
      default: '/uploads/dog-1.jpeg',
    },
    price: {
      type: Number,
      required: [true, `Please provide the dog's price`],
    },
    location: {
      type: String,
      required: [true, `Please provide the dog's location`],
    },
    type: {
      type: String,
      required: [true, `Please provide the dog's type`],
    },
    gender: {
      type: String,
      required: [true, `Please provide the dog's gender`],
      enum: {
        values: ['male', 'female'],
        message: `{VALUE} is not supported as dog's gender `,
      },
    },
    size: {
      type: String,
      required: [true, `Please provide the dog's size`],
      enum: {
        values: ['large', 'small', 'medium', 'extra large'],
        message: `{VALUE} is not supported for the dog's size`,
      },
    },
    age: {
      type: String,
      required: [true, `Please provide the dog's age`],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = new mongoose.model('Dog', DogSchema);
