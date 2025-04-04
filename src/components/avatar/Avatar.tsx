// import Image from "next/image";
import styles from "../../Styles/page.module.scss";

interface AvatarProps {
  name: string;
  picture: {
    url: string;
  };
}

export default function Avatar({ name, picture }: AvatarProps) {
  return (
    <div className={styles.imageContainer}>
    <img
      src={picture.url}
      className={styles.image}
      alt={name}
      sizes="48px"
    />
  </div>
  );
}