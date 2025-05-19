import { ModalType, Post } from '../../types/shared';
import Button from '../shared/Button';
import './DataTable.css';

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
    <dialog open={isOpen} className="modal">
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
              className="modal-input"
            />
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              value={post.body}
              onChange={(e) => onChange({ ...post, body: e.target.value })}
              required
              className="modal-textarea"
            />
          </div>
        )}
        <footer>
          {modalType === ModalType.VIEW ? (
            <Button variant="outline" size="small" onClick={onClose}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="primary" size="small" onClick={handleSubmit}>
                {modalType === 'add' ? 'Create' : 'Update'}
              </Button>
              <Button variant="danger" size="small" onClick={onClose}>
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
