import styles from './StarRating.module.scss'

export interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 3,
  size = 'medium',
  className = '',
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1)

  return (
    <div
      className={`${styles.rating} ${styles[size]} ${className}`}
      role="img"
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {stars.map((star) => (
        <svg
          key={star}
          className={`${styles.star} ${star <= rating ? styles.filled : styles.empty}`}
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6L8 1Z" />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
