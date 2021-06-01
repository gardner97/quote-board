import boto3
import json
from datetime import datetime, timedelta
import time

def handle_response(record_response):
    for r in record_response['Records']:
        try:
            #data = json.loads(r['Data'])
            #if (data['type'] == 'minute'):
            print(r['Data'].decode())
        except Exception as e:
            print("error:", e)
            print("r:", r)
        

#my_stream_name = 'cooper-stream'
#my_stream_name = 'intraday-kinesis'
my_stream_name = 'intraday-data'

kinesis_client = boto3.client('kinesis')

response = kinesis_client.describe_stream(StreamName=my_stream_name)

my_shard_id = response['StreamDescription']['Shards'][0]['ShardId']

shard_iterator = kinesis_client.get_shard_iterator(StreamName=my_stream_name,
                                                   ShardId=my_shard_id,
                                                   # ShardIteratorType='LATEST',
                                                   # ShardIteratorType='TRIM_HORIZON',
                                                   ShardIteratorType='AT_TIMESTAMP',
                                                   Timestamp=(datetime.utcnow()- timedelta(minutes=1)),
                                                   # ShardIteratorType='AFTER_SEQUENCE_NUMBER',
                                                   # StartingSequenceNumber='49612634557476378823913795498783482864958604696086380546',
)

my_shard_iterator = shard_iterator['ShardIterator']

record_response = kinesis_client.get_records(ShardIterator=my_shard_iterator, # Limit=2
)

handle_response(record_response)

while 'NextShardIterator' in record_response:
    record_response = kinesis_client.get_records(ShardIterator=record_response['NextShardIterator']# , Limit=2
    )
    handle_response(record_response)
    # wait for 5 seconds
    time.sleep(1)