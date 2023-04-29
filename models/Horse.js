const mongoose = require('mongoose');
const HorseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please provide  the horse's name`],
      trim: true,
      maxlength: [100, `Name can not be more than 100 characters`],
    },
    breed: {
      type: String,
      required: [true, `Please provide the horse's breed`],
      trim: true,
      maxlength: [
        150,
        `Horse's breed title can not be more than 150 characters`,
      ],
    },
    image: {
      type: String,
      default: '/uploads/horse-1.jpeg',
    },
    price: {
      type: Number,
      required: [true, `Please provide the horse's price`],
    },
    location: {
      type: String,
      required: [true, `Please provide the horse's location`],
    },
    type: {
      type: String,
      required: [true, `Please provide the horse's type`],
    },
    gender: {
      type: String,
      required: [true, `Please provide the horse's gender`],
      enum: {
        values: ['male', 'female'],
        message: `{VALUE} is not supported as horse's gender `,
      },
    },
    size: {
      type: String,
      required: [true, `Please provide the horse's size`],
      enum: {
        values: ['large', 'small', 'medium', 'extra large'],
        message: `{VALUE} is not supported as horse's size `,
      },
    },
    age: {
      type: String,
      required: [true, `Please provide the horse's age`],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = new mongoose.model('Horse', HorseSchema);
