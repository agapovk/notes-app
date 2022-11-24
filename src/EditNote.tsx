import React from 'react';
import { NoteData, Tag } from './App';
import NoteForm from './NoteForm';
import { useNote } from './NoteLayout';
import './i18n';
import { useTranslation } from 'react-i18next';

type EditNoteProps = {
	onSubmit: (id: string, data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

const EditNote = ({ onSubmit, onAddTag, availableTags }: EditNoteProps) => {
	const note = useNote();
	const { t } = useTranslation();

	return (
		<>
			<h1>{t('editNote')}</h1>
			<NoteForm
				title={note.title}
				markdown={note.markdown}
				tags={note.tags}
				onSubmit={(data) => onSubmit(note.id, data)}
				onAddTag={onAddTag}
				availableTags={availableTags}
			/>
		</>
	);
};

export default EditNote;
