import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';
export interface ReminderImpl extends Document {
  createdBy: mongoose.Types.ObjectId;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  color: string;
  repeat: string;
  eventId: string;
  reminder: string;
  participants: Array<string>;
  url: string;
}

const reminderSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
  },
  color: {
    type: String,
  },
  repeat: {
    type: String,
  },
  eventId: {
    type: String,
  },
  description: {
    type: String,
  },
  reminder: {
    type: String,
  },
  participants: [String],
  url: {
    type: String,
    trim: true,
  },
});
const Reminder: Model<ReminderImpl> = model<ReminderImpl>(
  'Reminder',
  reminderSchema
);

export default Reminder;
