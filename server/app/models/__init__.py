from .user import User
from .course import Course, Module, Lesson
from .enrollment import Enrollment
from .progress import UserProgress

# Export submodules as well to support models.course.Course style access
from . import user
from . import course
from . import enrollment
from . import progress
