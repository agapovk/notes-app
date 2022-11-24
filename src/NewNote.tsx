import React from 'react';
import { NoteData, Tag } from './App';
import NoteForm from './NoteForm';
import './i18n';
import { useTranslation } from 'react-i18next';

type NewNoteProps = {
	onSubmit: (data: NoteData) => void;
	onAddTag: (tag: Tag) => void;
	availableTags: Tag[];
};

const NewNote = ({ onSubmit, onAddTag, availableTags }: NewNoteProps) => {
	const { t } = useTranslation();

	return (
		<>
			<h1>{t('newHeader')}</h1>
			<NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} />
		</>
	);
};

export default NewNote;
