"""add candidate auth identity

Revision ID: 20260518_02
Revises: 20260518_01
Create Date: 2026-05-18 13:25:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260518_02"
down_revision = "20260518_01"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("candidate_profiles", sa.Column("auth_user_id", sa.String(length=128), nullable=True))
    op.add_column("candidate_profiles", sa.Column("email", sa.String(length=255), nullable=True))
    op.execute("UPDATE candidate_profiles SET auth_user_id = id WHERE auth_user_id IS NULL")
    op.execute("UPDATE candidate_profiles SET email = phone || '@placeholder.local' WHERE email IS NULL")
    op.alter_column("candidate_profiles", "auth_user_id", nullable=False)
    op.alter_column("candidate_profiles", "email", nullable=False)
    op.create_index("ix_candidate_profiles_auth_user_id", "candidate_profiles", ["auth_user_id"], unique=True)
    op.create_index("ix_candidate_profiles_email", "candidate_profiles", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_candidate_profiles_email", table_name="candidate_profiles")
    op.drop_index("ix_candidate_profiles_auth_user_id", table_name="candidate_profiles")
    op.drop_column("candidate_profiles", "email")
    op.drop_column("candidate_profiles", "auth_user_id")
