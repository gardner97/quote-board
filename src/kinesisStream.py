import boto3
import json
from datetime import datetime, timedelta
import time


# def is_grain(data):
#     return data['root'] in ['ZC', 'ZS', 'ZW']

is_first_run = True
byte_counter = 0

def handle_response(record_response):
    global is_first_run
    global byte_counter
    for r in record_response['Records']:
        # TRY#1 trims what data is printed to only some grains
        # currently results in NO WebSocket messages being sent
        try: #1
            data = json.loads(r['Data'])
            if (data['type'] == 'minute'):
                data_amt = json.dumps(data).count("")

            #     if data_amt + byte_counter > 8192:
            #         # if close to buffer cap, pad with #'s until full
            #         for i in range(8192 - byte_counter):
            #             print("#", end=" ")
            #             byte_counter += 1
            #         assert byte_counter <= 8192
            #         byte_counter = 0
            #     else:
            #     byte_counter += data_amt
                print(data)
            # else:
            #     print("{❌}")
        # TRY#2 is what was there originally, and it works ok
        # try: #2
        #     data = json.loads(r['Data'])
        #     print(data)
        except Exception as e:
            print("error:", e)
            print("r:", r)
    is_first_run = False
        

my_stream_name = 'cooper-stream'
# my_stream_name = 'intraday-kinesis'

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
is_first_run = False
while 'NextShardIterator' in record_response:
    record_response = kinesis_client.get_records(ShardIterator=record_response['NextShardIterator']# , Limit=2
    )
    handle_response(record_response)
    # wait for 5 seconds
    time.sleep(1)