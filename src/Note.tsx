import { useNote } from './NoteLayout';
import { Badge, Button, Col, Row, Stack } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './i18n';
import { useTranslation } from 'react-i18next';

type NoteProps = {
	onDelete: (id: string) => void;
};

const Note = ({ onDelete }: NoteProps) => {
	const note = useNote();
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<>
			<Row className='align-items-center mb-4'>
				<Col>
					<h1>{note.title}</h1>
					{note.tags.length > 0 && (
						<Stack direction='horizontal' gap={1} className='flex-wrap'>
							{note.tags.map((tag) => (
								<Badge bg='primary' key={tag.id} className='text-truncate'>
									{tag.label}
								</Badge>
							))}
						</Stack>
					)}
				</Col>
				<Col xs='auto'>
					<Stack direction='horizontal' gap={2}>
						<Link to={`/${note.id}/edit`}>
							<Button>{t('edit')}</Button>
						</Link>
						<Button
							variant='outline-danger'
							onClick={() => {
								onDelete(note.id);
								navigate('/');
							}}>
							{t('delete')}
						</Button>
						<Link to='..'>
							<Button variant='outline-secondary'>{t('back')}</Button>
						</Link>
					</Stack>
				</Col>
			</Row>
			<ReactMarkdown>{note.markdown}</ReactMarkdown>
		</>
	);
};

export default Note;
