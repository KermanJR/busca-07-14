import React from 'react';
import styles from'./Notification.module.css';

const Notification = ({ message, setOnDelete, onDelete }) => {


  console.log(onDelete)

  function closeNotification(){
    setOnDelete(!onDelete)
  }
  return (
    <div className={styles.notification_container}>
       <button className={styles.close_button} onClick={closeNotification}>
        <b>x</b>
      </button>
      <div className={styles.notification_content}>{message}</div>
     
    </div>
  );
};

export default Notification;
