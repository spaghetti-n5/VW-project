import { Post } from '../../types/post';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, post, onClose }) => (
  <dialog open={isOpen} className="modal">
    <article>
      <h2>Post Details</h2>
      <div>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
      <footer>
        <button className="outline small" onClick={onClose}>
          Close
        </button>
      </footer>
    </article>
  </dialog>
);

export default Modal;
