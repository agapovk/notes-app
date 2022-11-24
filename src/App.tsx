import 'bootstrap/dist/css/bootstrap.min.css ';
import { useMemo } from 'react';
import { Badge, Col, Container, Form, Row, Stack } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';
import NewNote from './NewNote';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidV4 } from 'uuid';
import NoteList from './NoteList';
import NoteLayout from './NoteLayout';
import Note from './Note';
import EditNote from './EditNote';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from './i18n';
import './i18n';

export type Note = {
	id: string;
} & NoteData;

export type RawNote = {
	id: string;
} & RawNoteData;

export type RawNoteData = {
	title: string;
	markdown: string;
	tagIds: string[];
};

export type NoteData = {
	title: string;
	markdown: string;
	tags: Tag[];
};

export type Tag = {
	id: string;
	label: string;
};

function App() {
	const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
	const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

	const { t, i18n } = useTranslation();

	const notesWithTags = useMemo(() => {
		return notes.map((note) => {
			return { ...note, tags: tags.filter((tag) => note.tagIds.includes(tag.id)) };
		});
	}, [notes, tags]);

	const onCreateNote = ({ tags, ...data }: NoteData) => {
		setNotes((prevNote) => {
			return [...prevNote, { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) }];
		});
	};

	const onEditNote = (id: string, { tags, ...data }: NoteData) => {
		setNotes((prevNotes) => {
			return prevNotes.map((note) => {
				if (note.id === id) {
					return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
				} else {
					return note;
				}
			});
		});
	};

	const onDeleteNote = (id: string) => {
		setNotes((prevNotes) => {
			return prevNotes.filter((note) => note.id !== id);
		});
	};

	const AddTag = (tag: Tag) => {
		setTags((prev) => [...prev, tag]);
	};

	const updateTag = (id: string, label: string) => {
		setTags((prevTags) => {
			return prevTags.map((tag) => {
				if (tag.id === id) {
					return { ...tag, label };
				} else {
					return tag;
				}
			});
		});
	};

	const deleteTag = (id: string) => {
		setTags((prevTags) => {
			return prevTags.filter((tag) => tag.id !== id);
		});
	};

	return (
		<Container className='p-3 border rounded my-sm-3'>
			<Row className='mb-4'>
				<Col xs='auto'>
					<Stack direction='horizontal' gap={2}>
						<Form.Select
							defaultValue={i18n.language}
							onChange={(e) => i18n.changeLanguage(e.target.value)}>
							{availableLanguages.map((language) => (
								<option key={language}>{language}</option>
							))}
						</Form.Select>
					</Stack>
				</Col>
			</Row>
			<Routes>
				<Route
					path='/'
					element={
						<NoteList
							notes={notesWithTags}
							availableTags={tags}
							onUpdateTag={updateTag}
							onDeleteTag={deleteTag}
						/>
					}
				/>
				<Route
					path='/new'
					element={<NewNote onSubmit={onCreateNote} onAddTag={AddTag} availableTags={tags} />}
				/>
				<Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
					<Route index element={<Note onDelete={onDeleteNote} />} />
					<Route
						path='edit'
						element={<EditNote onSubmit={onEditNote} onAddTag={AddTag} availableTags={tags} />}
					/>
				</Route>
				<Route path='*' element={<Navigate to='/' />} />
			</Routes>
		</Container>
	);
}

export default App;
