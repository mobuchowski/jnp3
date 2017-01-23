from django.conf import settings
import json

es = settings.ES_CLIENT

mappings = {
    "post": {
        "properties": {
            "text": {
                "type": "string",
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

def index_exists():
    return es.indices.exists(index='posts')

def post_search(user, text):
    users = [friend.id for friend in user.friends.all()]
    users.append(user.id)
    body = {
        "min_score": 0.5,
        "query": {
            "bool": {
                "should": {
                    "match": {
                        "text": text
                    }
                },
                "must": {
                    "terms": {
                        "author": users
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
