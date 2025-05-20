import { ModalType, Post } from '../../types/shared';
import Button from '../shared/Button';
import styles from './../../styles/Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
  modalType: ModalType;
  onSubmit: (post: Post) => Promise<void>;
  onChange: (post: Post) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, post, onClose, onChange, modalType, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = async () => {
    await onSubmit(post);
  };

  return (
    <dialog open={isOpen} className={styles.modal}>
      <article>
        <h2>
          {modalType === ModalType.ADD
            ? 'Add Post'
            : modalType === ModalType.EDIT
              ? 'Edit Post'
              : 'Post Details'}
        </h2>
        {modalType === ModalType.VIEW ? (
          <div>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ) : (
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={post.title}
              onChange={(e) => onChange({ ...post, title: e.target.value })}
              required
              className={styles.modalInput}
            />
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              value={post.body}
              onChange={(e) => onChange({ ...post, body: e.target.value })}
              required
              className={styles.modalTextarea}
            />
          </div>
        )}
        <footer>
          {modalType === ModalType.VIEW ? (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outline primary" onClick={handleSubmit}>
                {modalType === 'add' ? 'Create' : 'Update'}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </>
          )}
        </footer>
      </article>
    </dialog>
  );
};

export default Modal;
