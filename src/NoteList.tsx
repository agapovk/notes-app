import { useState, useMemo } from 'react';
import {
	Col,
	Row,
	Button,
	Stack,
	Form,
	FormGroup,
	Card,
	Badge,
	Modal,
	FormControl,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Tag } from './App';
import styles from './NoteList.module.css';
import './i18n';
import { useTranslation } from 'react-i18next';

type SimplifiedNote = {
	tags: Tag[];
	title: string;
	id: string;
};

type NoteListProps = {
	availableTags: Tag[];
	notes: SimplifiedNote[];
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

type EditTagsModalProps = {
	availableTags: Tag[];
	show: boolean;
	handleClose: () => void;
	onUpdateTag: (id: string, label: string) => void;
	onDeleteTag: (id: string) => void;
};

const NoteList = ({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) => {
	const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
	const [title, setTitle] = useState('');
	const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

	const { t } = useTranslation();

	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			return (
				(title === '' || note.title.toLowerCase().includes(title.toLowerCase())) &&
				(selectedTags.length === 0 ||
					selectedTags.every((tag) => note.tags.some((noteTag) => noteTag.id === tag.id)))
			);
		});
	}, [title, selectedTags, notes]);

	return (
		<>
			<Row className='mb-4 align-items-center'>
				<Col>
					<h1>{t('listHeader')}</h1>
				</Col>
				<Col xs='auto'>
					<Stack direction='horizontal' gap={2}>
						<Link to='/new'>
							<Button>{t('new')}</Button>
						</Link>
						<Button onClick={() => setEditTagsModalIsOpen(true)} variant='outline-secondary'>
							{t('editTags')}
						</Button>
					</Stack>
				</Col>
			</Row>
			<Form>
				<Row className='mb-4'>
					<Col>
						<FormGroup controlId='title'>
							<Form.Label>{t('search')}</Form.Label>
							<Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
						</FormGroup>
					</Col>
					<Col>
						<FormGroup controlId='tags'>
							<Form.Label>{t('tags')}</Form.Label>
							<ReactSelect
								value={selectedTags.map((tag) => {
									return { label: tag.label, value: tag.id };
								})}
								options={availableTags.map((tag) => {
									return { label: tag.label, value: tag.id };
								})}
								onChange={(tags) => {
									setSelectedTags(
										tags.map((tag) => {
											return { label: tag.label, id: tag.value };
										})
									);
								}}
								isMulti
							/>
						</FormGroup>
					</Col>
				</Row>
			</Form>
			<Row xs={1} xl={2} className='g-3'>
				{filteredNotes.map((note) => (
					<Col key={note.id}>
						<NoteCard id={note.id} title={note.title} tags={note.tags} />
					</Col>
				))}
			</Row>
			<EditTagsModal
				show={editTagsModalIsOpen}
				handleClose={() => setEditTagsModalIsOpen(false)}
				availableTags={availableTags}
				onUpdateTag={onUpdateTag}
				onDeleteTag={onDeleteTag}
			/>
		</>
	);
};

export default NoteList;

function EditTagsModal({
	availableTags,
	show,
	handleClose,
	onUpdateTag,
	onDeleteTag,
}: EditTagsModalProps) {
	const { t } = useTranslation();

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{t('editTags')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Stack gap={2}>
						{availableTags.map((tag) => {
							return (
								<Row key={tag.id}>
									<Col>
										<FormControl
											type='text'
											value={tag.label}
											onChange={(e) => onUpdateTag(tag.id, e.target.value)}
										/>
									</Col>
									<Col xs='auto'>
										<Button onClick={() => onDeleteTag(tag.id)} variant='outline-danger'>
											&times;
										</Button>
									</Col>
								</Row>
							);
						})}
					</Stack>
				</Form>
			</Modal.Body>
		</Modal>
	);
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
	return (
		<Card
			as={Link}
			to={`/${id}`}
			className={`text-reset text-decoration-none h-100 ${styles.card}`}>
			<Card.Body>
				<Stack gap={2}>
					<span className='fs-2'>{title}</span>
					{tags.length > 0 && (
						<Stack direction='horizontal' gap={1} className='flex-wrap'>
							{tags.map((tag) => (
								<Badge bg='primary' key={tag.id} className='text-truncate'>
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
}
