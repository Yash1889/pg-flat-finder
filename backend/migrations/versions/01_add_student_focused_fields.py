"""Add student focused fields

Revision ID: 01_add_student_focused_fields
Revises: 
Create Date: 2025-06-02

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import geoalchemy2
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '01_add_student_focused_fields'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum types first
    op.execute("CREATE TYPE propertytype AS ENUM ('pg', 'hostel', 'flat', 'room', 'apartment')")
    op.execute("CREATE TYPE roomtype AS ENUM ('single', 'double', 'triple', 'dormitory')")
    op.execute("CREATE TYPE genderpreference AS ENUM ('male', 'female', 'coed')")
    op.execute("CREATE TYPE foodfacility AS ENUM ('mess', 'mealsPlan', 'kitchen')")
    
    # Add price_type column
    op.add_column('properties', sa.Column('price_type', sa.String(20), nullable=True, server_default='monthly'))
    
    # Add student-focused details columns
    op.add_column('properties', sa.Column('room_type', postgresql.ENUM('single', 'double', 'triple', 'dormitory', name='roomtype'), nullable=True))
    op.add_column('properties', sa.Column('gender', postgresql.ENUM('male', 'female', 'coed', name='genderpreference'), nullable=True))
    op.add_column('properties', sa.Column('food_facility', postgresql.ENUM('mess', 'mealsPlan', 'kitchen', name='foodfacility'), nullable=True))
    op.add_column('properties', sa.Column('college_name', sa.String(255), nullable=True))
    op.add_column('properties', sa.Column('college_distance_km', sa.Float(), nullable=True))
    
    # Add student-focused amenities columns
    op.add_column('properties', sa.Column('has_study_room', sa.Boolean(), server_default='false', nullable=False))
    op.add_column('properties', sa.Column('has_mess', sa.Boolean(), server_default='false', nullable=False))
    op.add_column('properties', sa.Column('has_laundry', sa.Boolean(), server_default='false', nullable=False))
    op.add_column('properties', sa.Column('has_hot_water', sa.Boolean(), server_default='false', nullable=False))


def downgrade() -> None:
    # Drop student-focused amenities columns
    op.drop_column('properties', 'has_hot_water')
    op.drop_column('properties', 'has_laundry')
    op.drop_column('properties', 'has_mess')
    op.drop_column('properties', 'has_study_room')
    
    # Drop student-focused details columns
    op.drop_column('properties', 'college_distance_km')
    op.drop_column('properties', 'college_name')
    op.drop_column('properties', 'food_facility')
    op.drop_column('properties', 'gender')
    op.drop_column('properties', 'room_type')
    
    # Drop price_type column
    op.drop_column('properties', 'price_type')
    
    # Drop enum types
    op.execute("DROP TYPE foodfacility")
    op.execute("DROP TYPE genderpreference")
    op.execute("DROP TYPE roomtype")
    op.execute("DROP TYPE propertytype")
