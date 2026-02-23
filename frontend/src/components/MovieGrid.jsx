import { useApp } from "../context/AppContext"
import MovieCard from "./MovieCard"

export default function MovieGrid() {
  const { movies, hoveredId, setHovered, playMovie } = useApp()
  return (
    <div className="movie-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          isHovered={hoveredId === movie.id}
          onHover={setHovered}
          onLeave={() => setHovered(null)}
          onPlay={playMovie}
        />
      ))}
    </div>
  )
}
