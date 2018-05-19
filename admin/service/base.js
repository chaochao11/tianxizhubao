angular.module('app').service('baseService', ['$q', '$http', '$rootScope',
    function ($q, $http, $rootScope) {
        return {
            //上传图片
            uploadFile: function (fileObj, uploadPath) {
                var deferred = $q.defer();
                Upload.upload({
                    url: $rootScope.baseURL + 'api/admin/uploadImage',
                    data: {'uploadPath': uploadPath},
                    file: fileObj
                }).progress(function (evt) {
                    $scope.per = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.$broadcast('tt',$scope.per);
                }).success(function (data) {
                    deferred.resolve(data);

                }).error(function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            }
        }
    }]);
