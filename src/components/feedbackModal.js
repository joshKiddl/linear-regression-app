// import React from 'react';
// import Modal from 'react-modal';

// const FeedbackModal = ({
//   isOpen,
//   onRequestClose,
//   feedbackMessage,
//   handleFeedbackChange,
//   handleFeedbackSubmit,
//   feedbackFormState,
// }) => (
//   <Modal
//     isOpen={isOpen}
//     onRequestClose={onRequestClose}
//     contentLabel="Feedback Form"
//     className="modal"
//   >
//     <div className="modal-content">
//           <h3>How did you like this tool?</h3>
//           <p>
//             Was it helpful? Do you want to use AI more to help your product
//             management practice?
//           </p>
//           <p>Let us know your thoughts</p>
//           <form id="feedback-form" onSubmit={handleFeedbackSubmit}>
//             <label>
//               Name:
//               <input
//                 type="text"
//                 name="name"
//                 value={feedbackFormState.name}
//                 onChange={handleFeedbackChange}
//               />
//             </label>
//             <label>
//               Email:
//               <input
//                 type="text"
//                 name="email"
//                 value={feedbackFormState.email}
//                 onChange={handleFeedbackChange}
//               />
//             </label>
//             <label>
//               Role:
//               <input
//                 type="text"
//                 name="role"
//                 value={feedbackFormState.role}
//                 onChange={handleFeedbackChange}
//               />
//             </label>
//             <label>
//               Company:
//               <input
//                 type="text"
//                 name="company"
//                 value={feedbackFormState.company}
//                 onChange={handleFeedbackChange}
//               />
//             </label>
//             <label>
//               Feedback:
//               <textarea
//                 name="feedback"
//                 value={feedbackFormState.feedback}
//                 onChange={handleFeedbackChange}
//               />
//             </label>
//             <button className="modal-submit" type="submit">
//               Submit
//             </button>
//             {feedbackMessage && (
//               <p className="modal-message">{feedbackMessage}</p>
//             )}
//           </form>
//           <button
//             onClick={() => {
//               closeFeedbackModal();
//               setFeedbackMessage("");
//             }}
//             className="modal-close"
//           >
//             Close
//           </button>
//         </div>    
//   </Modal>
// );
// export default FeedbackModal;
