import { ModalType, Post } from '../../types/shared';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
  modalType: ModalType;
  onSubmit: (post: Post) => Promise<void>;
  onChange: (post: Post) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, post, onClose, onChange, modalType, onSubmit }) => {
  const handleSubmit = async () => {
    await onSubmit(post);
  };

  if (!isOpen || !modalType) return null;

  return (
    <dialog open={isOpen} className="modal">
      <article>
        <h2>{modalType === ModalType.EDIT ? 'Edit Post' : 'Post Details'}</h2>
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
          {modalType !== ModalType.VIEW && (
            <button className="outline small primary" onClick={handleSubmit}>
              Update
            </button>
          )}
          <button className="outline small" onClick={onClose}>
            Close
          </button>
        </footer>
      </article>
    </dialog>
  );
};

export default Modal;
