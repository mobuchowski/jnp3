from django.core.management.base import BaseCommand
from architect.commands import partition
from api.models import Post

class Command(BaseCommand):

    def handle(self, *args, **options):
        self.create_partitions()

    def create_partitions(self):
        try:
            partition.run(dict(module=Post.__module__))
        except ProgrammingError:
            # Possibly because models were just un-migrated or
            # fields have been changed that effect Architect
            print("Unable to apply partitions for module")
        else:
            print("Applied partitions for module")
