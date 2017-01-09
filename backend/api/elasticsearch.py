from elasticsearch import Elasticsearch
import json

# TODO: Host do podstawienia
es = Elasticsearch(['host:9200'])

mappings = {
    "post": {
        "properties": {
            "text": {
                "type" : "text",
                "analyzer": "english",
            },
            "author": {
                "type": "long",
            },
            "id": {
                "type": "long"
            }
        }
    },
}

def create_and_push_mappings():
    es.indices.create(index='posts', body={"mappings": mappings})


def post_search(user, text):
    friends = [friend.id for friend in user.friends]
    results = es.search(index='posts', doc_type='post', body={
        "query": {
            "match": {
                "text": text,
            },
            "term": {
                "author": json.dumps(friends)
            }
        }
    })
    return [result['id'] for result in results['hits']['hits']['_source']]


def post_create(user, text):
    es.create(index='posts', doc_type='post', body={
        "author": user.id,
        "text": text
    })