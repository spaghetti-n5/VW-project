import { useEffect, useRef, useState } from 'react';
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

const Modal: React.FC<ModalProps> = ({ isOpen, post, onClose, modalType, onSubmit, onChange }) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  // Store the triggering element
  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
  }, [isOpen]);

  // Focus trapping and Escape key handling
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    firstFocusableRef.current = first;
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Return focus on close
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { title?: string; body?: string } = {};
    if (!post.title.trim()) newErrors.title = 'Please enter a title';
    if (!post.body.trim()) newErrors.body = 'Please enter a body';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(post);
    }
  };

  if (!isOpen) return null;

  const isViewMode = modalType === ModalType.VIEW;
  const title =
    modalType === ModalType.ADD
      ? 'Add Post'
      : modalType === ModalType.EDIT
        ? 'Edit Post'
        : 'Post Details';

  return (
    <dialog
      open={isOpen}
      ref={modalRef}
      className={styles.modal}
      data-testid="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <article>
        <h2 id="modal-title">{title}</h2>
        {isViewMode ? (
          <>
            <div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
            <footer>
              {modalType === ModalType.VIEW ? (
                <Button variant="outline" onClick={onClose} ariaLabel="Close">
                  Close
                </Button>
              ) : null}
            </footer>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={post.title}
                onChange={(e) => onChange({ ...post, title: e.target.value })}
                required
                className={styles.modalInput}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <span id="title-error" className={styles.error} role="alert">
                  {errors.title}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="body">Body</label>
              <textarea
                id="body"
                value={post.body}
                onChange={(e) => onChange({ ...post, body: e.target.value })}
                required
                className={styles.modalTextarea}
                aria-invalid={!!errors.body}
                aria-describedby={errors.body ? 'body-error' : undefined}
              />
              {errors.body && (
                <span id="body-error" className={styles.error} role="alert">
                  {errors.body}
                </span>
              )}
            </div>
            <footer className={styles.modalFooter}>
              {!isViewMode && (
                <Button
                  variant="secondary"
                  type="submit"
                  ariaLabel={modalType === ModalType.ADD ? 'Create post' : 'Update post'}
                >
                  {modalType === ModalType.ADD ? 'Create' : 'Update'}
                </Button>
              )}
              <Button variant="outline" onClick={onClose} ariaLabel="Close modal">
                {isViewMode ? 'Close' : 'Cancel'}
              </Button>
            </footer>
          </form>
        )}
      </article>
    </dialog>
  );
};

export default Modal;
