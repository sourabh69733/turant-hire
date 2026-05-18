"""create candidate profiles

Revision ID: 20260518_01
Revises:
Create Date: 2026-05-18 12:20:00
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260518_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "candidate_profiles",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("phone", sa.String(length=24), nullable=False),
        sa.Column("primary_role", sa.String(length=120), nullable=False),
        sa.Column("location", sa.String(length=120), nullable=False),
        sa.Column("expected_pay", sa.String(length=64), nullable=False),
        sa.Column("availability", sa.String(length=120), nullable=False),
        sa.Column("is_ready_now", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("profile_summary", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_candidate_profiles_phone",
        "candidate_profiles",
        ["phone"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index("ix_candidate_profiles_phone", table_name="candidate_profiles")
    op.drop_table("candidate_profiles")
