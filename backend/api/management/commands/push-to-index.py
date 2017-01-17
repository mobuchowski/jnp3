from django.conf import settings
from api.elasticsearchApi import create_and_push_mappings, index_exists
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        self.recreate_index()

    def recreate_index(self):
        if not index_exists():
            create_and_push_mappings()
