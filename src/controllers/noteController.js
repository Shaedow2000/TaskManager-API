import wrapper from "../middlewares/asyncWrapper.js";
import NoteModel from "../models/note.js";

const getAll = wrapper(async (req, res) => {
  const userEmail = req.user.email;
  const notes = await NoteModel.findOne({ user: userEmail }, { __v: false });

  return res.status(200).json({
    status: 200,
    message: `Get all notes for user: ${userEmail}`,
    data: notes,
  });
});

const getById = wrapper(async (req, res) => {
  const userEmail = req.user.email;

  const data = await NoteModel.findOne({ user: userEmail }, { __v: false });

  const note = data.notes.find((note) => String(note._id) === req.params.id);

  if (!note) {
    return res.status(404).json({
      status: 404,
      message: `Note with id [ ${req.params.id} ] was not found`,
      data: null,
    });
  }

  return res.status(200).json({
    status: 200,
    message: `Get note [ ${req.params.id} ] for user: ${userEmail}`,
    data: note,
  });
});

const post = wrapper(async (req, res) => {
  const userEmail = req.user.email;
  const { title, text } = req.body;
  const newNote = { title, text };

  const newNotes = await NoteModel.findOneAndUpdate(
    { user: userEmail },
    { $push: { notes: newNote } },
    { returnDocument: "after", runValidators: true },
  );

  return res.status(201).json({
    status: 201,
    message: `Note created sucessfully`,
    data: newNotes,
  });
});

const patchById = wrapper(async (req, res) => {
  const userEmail = req.user.email;
  const { title, text } = req.body;

  const data = await NoteModel.findOne({ user: userEmail }, { __v: false });

  const note = data.notes.find((note) => String(note._id) === req.params.id);

  if (!note) {
    return res.status(404).json({
      status: 404,
      message: `Note with id [ ${req.params.id} ] was not found`,
      data: null,
    });
  }

  note.title = title !== undefined ? title : note.title;
  note.text = text !== undefined ? text : note.text;

  await data.save();

  return res.status(202).json({
    status: 202,
    message: `Note updated sucessfully`,
    data: note,
  });
});

const deleteById = wrapper(async (req, res) => {
  const userEmail = req.user.email;
  const data = await NoteModel.findOne({ user: userEmail }, { __v: false });

  if (!data.notes.find((note) => String(note._id) === req.params.id)) {
    return res.status(404).json({
      status: 404,
      message: `Note with id [ ${req.params.id} ] was not found`,
      data: null,
    });
  }

  data.notes = data.notes.filter((note) => String(note._id) !== req.params.id);

  await data.save();

  return res.status(202).json({
    status: 202,
    message: `Deleted note sucessfully`,
    data: null,
  });
});

export { getAll, getById, post, patchById, deleteById };
