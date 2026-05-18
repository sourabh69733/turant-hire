"""create requirements table

Revision ID: 20260518_04
Revises: 20260518_03
Create Date: 2026-05-18 14:30:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260518_04"
down_revision = "20260518_03"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "requirements",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("employer_auth_user_id", sa.String(length=128), nullable=False),
        sa.Column("employer_email", sa.String(length=255), nullable=False),
        sa.Column("company_name", sa.String(length=160), nullable=False),
        sa.Column("hiring_role", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=120), nullable=False),
        sa.Column("urgency", sa.String(length=80), nullable=False),
        sa.Column("compensation", sa.String(length=80), nullable=False),
        sa.Column("openings", sa.Integer(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="submitted"),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_requirements_employer_auth_user_id", "requirements", ["employer_auth_user_id"], unique=False)
    op.create_index("ix_requirements_employer_email", "requirements", ["employer_email"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_requirements_employer_email", table_name="requirements")
    op.drop_index("ix_requirements_employer_auth_user_id", table_name="requirements")
    op.drop_table("requirements")
