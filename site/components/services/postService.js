angular.module('ucrCareerServices')
    .service('PostService', ['$http', '$q', 'User', 'USER_ROLES', function PostService($http, $q, User, USER_ROLES){
        var extend = angular.extend;
        var forEach = angular.forEach,
            isObject = angular.isObject,
            copy = angular.copy;

        var copyNonNull = function(src, dest) {
            if(dest) {
                copy(src, dest);
            } else {
                dest = copy(src); 
            }

            if(isObject(dest)) {
                forEach(dest, function(value, key) {
                    if(!value) {
                        delete dest[key];
                    }
                });
            }
            return dest;
        };

        var JOB_POST_DATA_FIELDS = {};

        JOB_POST_DATA_FIELDS[USER_ROLES.employer] = ['specifics', 'location', 'date', 'media', 'tags'];
        
        var jobPostData = JOB_POST_DATA_FIELDS[USER_ROLES.employer];

        var Post = {
            'specifics': {
                'jobTitle': null, 
                'description': null, 
                'requirements': null, 
                'salary': null, 
                'application': null,
                'department': null,
                'jobType': null
            },
            'location': {
                'city': null,
                'state': null
            },
            'date': {
                'postedOn': null,
                'endsOn': null
            },
            'media': {
                'images': null,
                'video': null
            },
            'tags': []
        };

        var getJobPostDataFields = function() {
            return jobPostData;
        };

        this.setJobPostData = function(data) {
            var jobPostDataFields = getJobPostDataFields();
            forEach(data, function(value, key) {
                if(jobPostDataFields.indexOf(key) !== -1) {
                    Post[key] = copyNonNull(data[key]);
                }
            });
        };

        this.getJobPostingData = function() {
            var info = {},
                jobPostDataFields = getJobPostDataFields();
            
            forEach(Post, function(value, key) {
                forEach(jobPostDataFields, function(jobPostDataField) {
                    if(value && (key === jobPostDataField)) {
                        info[jobPostDataField] = 
                            copyNonNull(value);
                    }
                });  
            });
            return info;
        };
        
        this.post = function() {
            var deferred = $q.defer(),
                jobPostingRoutePrefix = '/post',
                jobPostData = job.getJobPostData();
                
                if(!jobPostData || !User.isEmployer()) {
                    deferred.reject();
                    return deferred.promise; 
                }
                $http.post(jobPostingRoutePrefix, jobPostData)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };
    }]);
