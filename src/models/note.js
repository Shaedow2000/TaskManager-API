import * as mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  notes: [
    {
      title: {
        type: String,
        maxLength: [60, "Exeeded title length limit (max up to 60 characters)"],
        required: true,
      },
      text: {
        type: String,
        maxLength: [
          600,
          "Exeeded text length limit (max up to 600 characters)",
        ],
        default: "No note taken yet!",
      },
    },
  ],
});

const NoteModel = mongoose.model("Note", NoteSchema);

export default NoteModel;
