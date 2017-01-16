from elasticsearch import Elasticsearch
import json

# TODO: Host do podstawienia
es = Elasticsearch(['localhost:9200'])

mappings = {
    "post": {
        "properties": {
            "text": {
                "type": "text",
                "analyzer": "english"
            },
            "author": {
                "type": "long"
            },
            "id": {
                "type": "long"
            }
        }
    }
}

def create_and_push_mappings():
    es.indices.create(index='posts', body={"mappings": mappings})


def post_search(user, text):
    friends = [friend.id for friend in user.friends.all()]
    body = {
        "query": {
            "bool": {
                "should": {
                    "match": {
                        "text": text
                    }
                },
                "must": {
                    "terms": {
                        "author": friends
                    }
                }
            }
        }
    }
    results = es.search(index='posts', doc_type='post', body=body)
    return [result['_source']['id'] for result in results['hits']['hits']]


def post_create(user, text, id):
    es.create(index='posts', doc_type='post', id=id, body={
        "author": user.id,
        "text": text,
        "id": id
    })