class MovieError(Exception):
    """Base exception class for movie-related errors."""
    pass

class MovieNotFoundError(MovieError):
    """Raised when a movie is not found."""
    def __init__(self, message: str = "Movie not found"):
        self.message = message
        super().__init__(self.message)

class UnauthorizedError(MovieError):
    """Raised when there is an authentication or authorization error."""
    def __init__(self, message: str = "Unauthorized access"):
        self.message = message
        super().__init__(self.message)

class RateLimitError(MovieError):
    """Raised when the API rate limit is exceeded."""
    def __init__(self, message: str = "Too many requests"):
        self.message = message
        super().__init__(self.message)

class ValidationError(MovieError):
    """Raised when there is a validation error."""
    def __init__(self, message: str = "Validation error"):
        self.message = message
        super().__init__(self.message)

class DatabaseError(MovieError):
    """Raised when there is a database error."""
    def __init__(self, message: str = "Database error"):
        self.message = message
        super().__init__(self.message)

class ExternalAPIError(MovieError):
    """Raised when there is an error with an external API."""
    def __init__(self, message: str = "External API error"):
        self.message = message
        super().__init__(self.message) 

class ResourceNotFoundError(MovieError):
    """Raised when a resource is not found."""
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(self.message)
        
